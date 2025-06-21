// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TodoList is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct Task {
        uint256 id;
        string title;
        string description;
        string ipfsHash;
        bool completed;
        uint256 createdAt;
        uint256 completedAt;
        address owner;
        address delegatedTo;
        bool isNFT;
        uint256 nftTokenId;
    }
    
    struct UserStats {
        uint256 totalTasks;
        uint256 completedTasks;
        uint256 currentStreak;
        uint256 lastCompletionDate;
        uint256 maxStreak;
    }
    
    mapping(uint256 => Task) public tasks;
    mapping(address => uint256[]) public userTasks;
    mapping(address => UserStats) public userStats;
    mapping(uint256 => bool) public taskExists;
    
    uint256 public taskCounter;
    
    event TaskCreated(uint256 indexed taskId, address indexed owner, string title);
    event TaskCompleted(uint256 indexed taskId, address indexed completer);
    event TaskDeleted(uint256 indexed taskId, address indexed owner);
    event TaskDelegated(uint256 indexed taskId, address indexed from, address indexed to);
    event TaskMintedAsNFT(uint256 indexed taskId, uint256 indexed tokenId, address indexed owner);
    event StreakUpdated(address indexed user, uint256 currentStreak, uint256 maxStreak);
    
    constructor() ERC721("TodoTask", "TASK") {}
    
    function createTask(
        string memory _title,
        string memory _description,
        string memory _ipfsHash
    ) external {
        taskCounter++;
        
        tasks[taskCounter] = Task({
            id: taskCounter,
            title: _title,
            description: _description,
            ipfsHash: _ipfsHash,
            completed: false,
            createdAt: block.timestamp,
            completedAt: 0,
            owner: msg.sender,
            delegatedTo: address(0),
            isNFT: false,
            nftTokenId: 0
        });
        
        userTasks[msg.sender].push(taskCounter);
        taskExists[taskCounter] = true;
        userStats[msg.sender].totalTasks++;
        
        emit TaskCreated(taskCounter, msg.sender, _title);
    }
    
    function completeTask(uint256 _taskId) external {
        require(taskExists[_taskId], "Task does not exist");
        require(!tasks[_taskId].completed, "Task already completed");
        
        Task storage task = tasks[_taskId];
        address completer = msg.sender;
        
        // Check if user can complete this task
        require(
            task.owner == completer || task.delegatedTo == completer,
            "Not authorized to complete this task"
        );
        
        task.completed = true;
        task.completedAt = block.timestamp;
        
        // Update stats for the completer
        _updateStreak(completer);
        userStats[completer].completedTasks++;
        
        emit TaskCompleted(_taskId, completer);
    }
    
    function delegateTask(uint256 _taskId, address _to) external {
        require(taskExists[_taskId], "Task does not exist");
        require(tasks[_taskId].owner == msg.sender, "Only owner can delegate");
        require(!tasks[_taskId].completed, "Cannot delegate completed task");
        require(_to != address(0), "Invalid delegate address");
        
        tasks[_taskId].delegatedTo = _to;
        emit TaskDelegated(_taskId, msg.sender, _to);
    }
    
    function deleteTask(uint256 _taskId) external {
        require(taskExists[_taskId], "Task does not exist");
        require(tasks[_taskId].owner == msg.sender, "Only owner can delete");
        require(!tasks[_taskId].isNFT, "Cannot delete NFT task");
        
        // Remove from user's task list
        uint256[] storage ownerTasks = userTasks[msg.sender];
        for (uint256 i = 0; i < ownerTasks.length; i++) {
            if (ownerTasks[i] == _taskId) {
                ownerTasks[i] = ownerTasks[ownerTasks.length - 1];
                ownerTasks.pop();
                break;
            }
        }
        
        delete tasks[_taskId];
        taskExists[_taskId] = false;
        userStats[msg.sender].totalTasks--;
        
        emit TaskDeleted(_taskId, msg.sender);
    }
    
    function mintTaskAsNFT(uint256 _taskId, string memory _tokenURI) external {
        require(taskExists[_taskId], "Task does not exist");
        require(tasks[_taskId].completed, "Task must be completed");
        require(tasks[_taskId].owner == msg.sender, "Only owner can mint");
        require(!tasks[_taskId].isNFT, "Task already minted as NFT");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        
        tasks[_taskId].isNFT = true;
        tasks[_taskId].nftTokenId = newTokenId;
        
        emit TaskMintedAsNFT(_taskId, newTokenId, msg.sender);
    }
    
    function _updateStreak(address _user) internal {
        UserStats storage stats = userStats[_user];
        uint256 today = block.timestamp / 86400; // Days since epoch
        uint256 lastDay = stats.lastCompletionDate / 86400;
        
        if (lastDay == 0) {
            // First task completion
            stats.currentStreak = 1;
            stats.maxStreak = 1;
        } else if (today == lastDay + 1) {
            // Consecutive day
            stats.currentStreak++;
            if (stats.currentStreak > stats.maxStreak) {
                stats.maxStreak = stats.currentStreak;
            }
        } else if (today > lastDay + 1) {
            // Streak broken
            stats.currentStreak = 1;
        }
        // If today == lastDay, don't update streak (same day completion)
        
        stats.lastCompletionDate = block.timestamp;
        emit StreakUpdated(_user, stats.currentStreak, stats.maxStreak);
    }
    
    function getUserTasks(address _user) external view returns (uint256[] memory) {
        return userTasks[_user];
    }
    
    function getTask(uint256 _taskId) external view returns (Task memory) {
        require(taskExists[_taskId], "Task does not exist");
        return tasks[_taskId];
    }
    
    function getUserStats(address _user) external view returns (UserStats memory) {
        return userStats[_user];
    }
    
    // Override required by Solidity
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
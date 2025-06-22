import hre from "hardhat";

async function main() {
  const TodoList = await hre.ethers.getContractFactory("TodoList");
  const todoList = await TodoList.deploy();
  await todoList.waitForDeployment();
  console.log("TodoList deployed to:", await todoList.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

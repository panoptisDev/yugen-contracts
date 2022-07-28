// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ConstructorParams = require("../farm_wrapper.json");

async function main() {
  const FarmWrapper = await hre.ethers.getContractFactory("FarmWrapper");
  const farmWrapperInstance = await FarmWrapper.deploy(
    ConstructorParams.farm,
    ConstructorParams.universalOneSidedFarm,
    ConstructorParams.quickswapRouter,
    ConstructorParams.quickswapLP,
    ConstructorParams.token,
    ConstructorParams.secondaryToken
  );
  await farmWrapperInstance.deployed();
  console.log("Farm wrapper deployed at " + farmWrapperInstance.address);
  await farmWrapperInstance.deployTransaction.wait([(confirms = 6)]);

  await hre.run("verify:verify", {
    address: farmWrapperInstance.address,
    constructorArguments: [
      ConstructorParams.farm,
      ConstructorParams.universalOneSidedFarm,
      ConstructorParams.quickswapRouter,
      ConstructorParams.quickswapLP,
      ConstructorParams.token,
      ConstructorParams.secondaryToken,
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

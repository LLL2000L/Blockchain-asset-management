const OneCompany = artifacts.require("OneCompany");

module.exports = function (deployer) {
  deployer.deploy(OneCompany, { gas: 67219750 });
};

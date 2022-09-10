rm -rf artifacts/solc
solc --abi contracts/PackageManager.sol -o artifacts/solc
mkdir -p artifacts/go
abigen --abi=./artifacts/solc/PackageManager.abi --pkg=packagemanager --out=artifacts/go/PackageManager.go
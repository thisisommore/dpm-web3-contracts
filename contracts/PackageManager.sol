// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

contract PackageManager is
    Context,
    AccessControlEnumerable,
    ERC721Enumerable,
    ERC721Burnable,
    ERC721Pausable
{
    using Counters for Counters.Counter;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    mapping(uint256 => string) private _tokenURIs;
    struct Package {
        address owner;
        string defaultVersion;
        mapping(string => string) versionToDataHash;
    }

    event PackageCreated(
        uint256 tokenID,
        string metaDataHash,
        address owner,
        string pkgName
    );
    event PackageVersionCreated(
        string pkgName,
        string versionName,
        string dataHash,
        bool changeDefaultVersion
    );

    event DefaultVersionChanged(string pkgName, string versionName);
    mapping(string => Package) public nameToPackage;

    modifier onlyPackageOwner(string memory packageName) {
        address packageOwner = nameToPackage[packageName].owner;
        require(_msgSender() == packageOwner, "sender is not owner of package");
        _;
    }

    modifier onlyPackageNotExist(string memory packageName) {
        address packageOwner = nameToPackage[packageName].owner;
        require(address(0) == packageOwner, "package already exist");
        _;
    }

    modifier onlyVersionExist(
        string memory packageName,
        string memory version
    ) {
        string memory dataHash = nameToPackage[packageName].versionToDataHash[
            version
        ];
        require(bytes(dataHash).length > 0, "version does not exist");
        _;
    }

    modifier onlyVersionNotExist(
        string memory packageName,
        string memory version
    ) {
        string memory dataHash = nameToPackage[packageName].versionToDataHash[
            version
        ];
        require(bytes(dataHash).length == 0, "version already exist");
        _;
    }

    /**
     * @dev Returns data hash of the release specified
     */
    function getRelease(string memory pkgName, string memory pkgVersion)
        public
        view
        onlyVersionExist(pkgName, pkgVersion)
        returns (string memory)
    {
        return nameToPackage[pkgName].versionToDataHash[pkgVersion];
    }

    Counters.Counter public _tokenIdTracker;

    /**
     * @dev Creates package with the name and metadataHash for the Soulbound NFT
     */
    function createPackage(
        string memory packageName,
        string memory metadataHash
    ) public onlyPackageNotExist(packageName) returns (uint256) {
        require(
            bytes(packageName).length != 0,
            "package name cannot be empty string"
        );
        nameToPackage[packageName].owner = _msgSender();

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        _tokenIdTracker.increment();
        uint256 currentTokenID = _tokenIdTracker.current();
        _safeMint(_msgSender(), currentTokenID);
        _setTokenURI(currentTokenID, metadataHash);
        emit PackageCreated(
            currentTokenID,
            metadataHash,
            _msgSender(),
            packageName
        );
        return currentTokenID;
    }

    /**
     * @dev Creates new release for the specified package.
     */
    function releaseNewVersion(
        string memory packageName,
        string memory versionName,
        string memory dataHash,
        bool isDefault
    )
        public
        onlyPackageOwner(packageName)
        onlyVersionNotExist(packageName, versionName)
    {
        require(
            bytes(dataHash).length != 0,
            "data hash cannot be empty string"
        );

        require(
            bytes(versionName).length != 0,
            "version cannot be empty string"
        );
        nameToPackage[packageName].versionToDataHash[versionName] = dataHash;
        bool changeDefaultVersion = isDefault ||
            bytes(nameToPackage[packageName].defaultVersion).length == 0;
        if (changeDefaultVersion) {
            nameToPackage[packageName].defaultVersion = versionName;
        }
        emit PackageVersionCreated(
            packageName,
            versionName,
            dataHash,
            changeDefaultVersion
        );
    }

    /**
     * @dev Sets default version for package which can be used by client to fetch, mainly to fetch latest stable releaase.
     */
    function setDefaultVersion(
        string memory packageName,
        string memory versionName
    )
        public
        onlyPackageOwner(packageName)
        onlyVersionExist(packageName, versionName)
    {
        nameToPackage[packageName].defaultVersion = versionName;
        emit DefaultVersionChanged(packageName, versionName);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Restricts NFT transfer unless it is mint transfer from null address.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable, ERC721Pausable) {
        require(from == address(0), "NFT is Soulbound");
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Creatify: Non-Existent Artifact");
        string memory _tokenURI = _tokenURIs[tokenId];

        return _tokenURI;
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(_exists(tokenId), "Creatify: Non-Existent Artifact");
        _tokenURIs[tokenId] = _tokenURI;
    }
}

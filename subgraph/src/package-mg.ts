import { log } from "@graphprotocol/graph-ts"
import {
  DefaultVersionChanged,
  PackageCreated,
  PackageVersionCreated
} from "../generated/PackageMg/PackageMg"
import { Package, PkgRelease } from "../generated/schema"

export function handlePackageCreated(event: PackageCreated): void {
  const nPackage = new Package(event.params.pkgName)
  nPackage.owner = event.params.owner
  nPackage.defaultVersion = ""
  nPackage.save()
}

export function handlePackageVersionCreated(
  event: PackageVersionCreated
): void {
  const nPackage = Package.load(event.params.pkgName)
  if (!nPackage) {
    log.error("package with name {} doesn't exist", [event.params.pkgName])
    return
  }
  const pkgReleaseId = event.params.versionName + event.params.pkgName
  const pkgR = new PkgRelease(pkgReleaseId)
  pkgR.version = event.params.versionName
  pkgR.pkg = event.params.pkgName;
  pkgR.dataHash = event.params.dataHash;
  if (event.params.changeDefaultVersion) {
    nPackage.defaultVersion = pkgReleaseId
    nPackage.save()
  }
  pkgR.save()
}

export function handleDefaultVersionChanged(
  event: DefaultVersionChanged
): void {
  const nPackage = Package.load(event.params.pkgName)
  if (!nPackage) {
    log.error("package with name {} doesn't exist", [event.params.pkgName])
    return
  }
  const pkgReleaseId = event.params.versionName + event.params.pkgName
  const pkgR = PkgRelease.load(pkgReleaseId)
  if (!pkgR) {
    log.error("package with name {} and release {} doesn't exist", [event.params.pkgName, event.params.versionName])
    return
  }
  nPackage.defaultVersion = pkgReleaseId
  nPackage.save()
}

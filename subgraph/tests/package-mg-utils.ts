import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  PackageCreated,
  PackageVersionCreated
} from "../generated/PackageMg/PackageMg"

export function createPackageCreatedEvent(
  owner: Address,
  pkgName: string
): PackageCreated {
  let packageCreatedEvent = changetype<PackageCreated>(newMockEvent())

  packageCreatedEvent.parameters = new Array()

  packageCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  packageCreatedEvent.parameters.push(
    new ethereum.EventParam("pkgName", ethereum.Value.fromString(pkgName))
  )

  return packageCreatedEvent
}

export function createPackageVersionCreatedEvent(
  pkgName: string,
  versionName: string,
  dataHash: string
): PackageVersionCreated {
  let packageVersionCreatedEvent = changetype<PackageVersionCreated>(
    newMockEvent()
  )

  packageVersionCreatedEvent.parameters = new Array()

  packageVersionCreatedEvent.parameters.push(
    new ethereum.EventParam("pkgName", ethereum.Value.fromString(pkgName))
  )
  packageVersionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "versionName",
      ethereum.Value.fromString(versionName)
    )
  )
  packageVersionCreatedEvent.parameters.push(
    new ethereum.EventParam("dataHash", ethereum.Value.fromString(dataHash))
  )

  return packageVersionCreatedEvent
}

# Extension of the vSphere SDK for JavaScript

## Overview

A collection of utilities that simplify the usage of the vSphere SDK for
JavaScript.

## Requirements

The vSphere SDK for JavaScript deliverable has to be obtained from the VMware
Flings website and configured as a dependency prior the use of this extension.

## Usage

The project currently offers a common set of utilities which can be used with
both vsphere.integrityService and vsphere.vimService.

The following sample demonstrates how an extension instance can to be obtained
and used:

```javascript
import * as util from "util";
import * as vsphere from "vsphere";
import * as vspherex from "vspherex";

(async (hostname, username, password) => {

  const vimService = await vsphere.vimService(hostname);
  const {
    serviceContent: {
      rootFolder,
      sessionManager
    },
    vim,
    vimPort
  } = vimService;
  await vimPort.login(sessionManager, username, password, null);
  try {
    // Create an instance of the extension
    const vimEx = vspherex.vimEx(vimService);
    // Retrieve all datacenter references
    const refs = await vimEx.retrieveReferences(rootFolder,
        vimEx.entity.Datacenter, 1);
    if (refs.length === 0) {
      throw new Error("No datacenters available");
    }
    // Retrieve all hosts placed in the first datacenter and their "vm"
    // property values
    const entities = await vimEx.retrieveEntities(refs[0],
        vimEx.entity.HostSystem, 1, "vm");
    if (entities.length === 0 || entities[0].props.vm.length === 0) {
      throw new Error("No virtual machines available");
    }
    const ref = entities[0].props.vm[0];
    // Retrieve the power state of the virtual machine
    const powerState = await vimEx.retrieveProperty(ref,
        "summary.runtime.powerState");
    if (powerState === vim.VirtualMachinePowerState.poweredOff ||
        powerState === vim.VirtualMachinePowerState.suspended) {
      throw new Error("The selected virtual machine is not powered on");
    }
    // Execute power off/on tasks and wait for their completion
    await vimEx.waitForTask(await vimPort.powerOffVMTask(ref));
    await vimEx.waitForTask(await vimPort.powerOnVMTask(ref, null));
    // Retrieve more virtual machine properties
    const props = await vimEx.retrieveProperties(ref, "name",
        "summary.runtime.bootTime");
    // Print success message
    console.log(util.format("The '%s' has been powered on %dms ago.",
        props.name, Date.now() - props.summary.runtime.bootTime.getTime()));
  } catch (err) {
    console.error(err);
  }
  await vimPort.logout(sessionManager);

})("vsphere.local", "user", "pass");
```

## Samples

The project contains a number of samples which rely on TypeScript and can be
executed using Node.js. The following script can be used as a shortcut for the
required build and invocation steps:

`npm run script -- <sample> [<args>]`

An example of the above looks like the following:

`npm run script -- samples/createVirtualMachine.js -h 'vsphere.local' -u 'user' 
-p 'pass' -i -s 'Datacenter' 'datastore1' 'test' 1 64`

## License

[MIT](LICENSE)

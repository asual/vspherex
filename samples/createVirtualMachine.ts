/*
 * Copyright (c) 2017 Rostislav Hristov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as stdio from "stdio";
import * as util from "util";
import * as vsphere from "vsphere";
import * as vspherex from "../../vspherex";

const opts = stdio.getopt({
  debug: {
    description: "Print debug details",
    key: "d"
  },
  hostname: {
    args: 1,
    description: "vSphere hostname",
    key: "h",
    mandatory: true
  },
  insecure: {
    description: "Allow untrusted connections",
    key: "i"
  },
  password: {
    args: 1,
    description: "vSphere password",
    key: "p",
    mandatory: true
  },
  spec: {
    args: 5,
    description: "Creation spec in " +
        "<datacenter_name> <datastore_name> <vm_name> <num_cpu> <memory_mb> " +
        "format",
    key: "s",
    mandatory: true
  },
  username: {
    args: 1,
    description: "vSphere username",
    key: "u",
    mandatory: true
  }
});

(async ({debug, guest, hostname, insecure, password, spec, username}) => {

  if (insecure) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  }

  const vimService = await vsphere.vimService(hostname, {
    debug
  });
  const vimEx = vspherex.vimEx(vimService);
  const {
    serviceContent: {
      guestOperationsManager,
      rootFolder,
      sessionManager
    },
    vim,
    vimPort
  } = vimService;
  await vimPort.login(sessionManager, username, password, null);

  const entities = await vimEx.retrieveEntities(rootFolder,
      vimEx.entity.Datacenter, 10, "name", "vmFolder");
  const datacenter = entities.find((entity) => entity.props.name === spec[0]);
  const refs = await vimEx.retrieveReferences(datacenter.ref,
      vimEx.entity.ResourcePool, 1);
  const configSpec = vim.VirtualMachineConfigSpec({
    files: vim.VirtualMachineFileInfo({
      vmPathName: "[" + spec[1] + "]"
    }),
    memoryMB: parseInt(spec[4], 10),
    name: spec[2],
    numCPUs: parseInt(spec[3], 10)
  });
  const task = await vimPort.createVMTask(datacenter.props.vmFolder,
      configSpec, refs[0], null);
  await vimEx.waitForTask(task);
  const ref = await vimEx.retrieveProperty(task, "info.result");
  console.log(util.format("Created %j", ref));
  await vimPort.destroyTask(ref);
  await vimPort.logout(sessionManager);

})(opts);

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

import * as path from "path";
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
  username: {
    args: 1,
    description: "vSphere username",
    key: "u",
    mandatory: true
  }
});

(async ({debug, hostname, insecure, password, username}) => {

  if (insecure) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  let integrityOptions = {
    debug,
    definitions: ["file://" + path.join(__dirname,
        "../definitions/integrityService/integrityService.wsdl")]
  };
  const [
    integrityService,
    vimService
  ] = await Promise.all([
    vsphere.integrityService(hostname, integrityOptions),
    vsphere.vimService(hostname, {
      debug
    })
  ]);

  const integrityEx = vspherex.integrityEx(integrityService);
  const {
    serviceContent: {
      complianceStatusManager,
      sessionManager: integritySessionManager
    },
    integrity,
    integrityPort
  } = integrityService;
  const vimEx = vspherex.vimEx(vimService);
  const {
    serviceContent: {
      rootFolder,
      sessionManager
    },
    vim,
    vimPort
  } = vimService;

  const session = await vimPort.login(sessionManager, username, password, null);
  const entities = await vimEx.retrieveEntities(rootFolder,
      vimEx.entity.HostSystem, 10, "name");
  await integrityPort.vciLogin(integritySessionManager, username,
      session.key, null);
  await Promise.all(entities.map(async (entity) => {
    const statusCollector = await integrityPort.getComplianceStatus(
        complianceStatusManager,
        integrityService.vim.ManagedObjectReference({
          type: entity.ref.type,
          value: entity.ref.value
        }));
    const statuses = await integrityEx.retrieveProperty(statusCollector,
        "status");
    console.log(util.format("Compliance status of %s is %j",
        entity.props.name, statuses));
  }));
  await integrityPort.vciLogout(integritySessionManager);

})(opts);

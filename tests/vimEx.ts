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

import * as fs from "fs";
import * as nock from "nock";
import * as path from "path";
import * as tap from "tap";
import * as vsphere from "vsphere";
import * as vspherex from "../../vspherex";

tap.test("vimEx", async () => {
  const hostname = "localhost";
  const url = "https://" + hostname;
  const definitions = path.join(__dirname, "../definitions/vimService");
  fs.readdirSync(definitions).forEach((file) => {
    nock(url).get("/sdk/" + file).replyWithFile(200,
        path.join(definitions, file));
  });
  nock(url).post("/sdk").replyWithFile(200,
      path.join(__dirname, "vimEx/retrieveServiceContent.xml"));

  const vimService = await vsphere.vimService(hostname);
  const vimEx = vspherex.vimEx(vimService);
  const {
    serviceContent,
    vim
  } = vimService;

  nock(url).post("/sdk").replyWithFile(200,
      path.join(__dirname, "vimEx/retrievePropertiesEx.xml"));
  nock(url).post("/sdk").replyWithFile(200,
      path.join(__dirname, "vimEx/continueRetrievePropertiesEx.xml"));

  const entities = await vimEx.retrieveEntities(serviceContent.rootFolder,
      vimEx.entity.VirtualMachine, 20, "name", "summary.overallStatus",
      "summary.runtime.bootTime", "summary.runtime");

  tap.equal(entities.length, 15);
  tap.equal(entities[0].ref instanceof vim.ManagedObjectReference, true);
  tap.equal(entities[0].ref.type, vimEx.entity.VirtualMachine);
  tap.equal(entities[0].ref.value, "vm-101");
  tap.equal(entities[0].props.name, "vm-101");
  tap.equal(entities[0].props.summary.runtime.bootTime.getTime(),
      new Date("2017-03-22T20:26:14.337Z").getTime());

  nock.cleanAll();
});

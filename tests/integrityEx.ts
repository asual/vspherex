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

tap.test("integrityEx", async () => {
  const hostname = "localhost";
  const url = "https://" + hostname + ":8084";
  const definitions = path.join(__dirname, "../definitions/integrityService");
  fs.readdirSync(definitions).forEach((file) => {
    nock(url).get("/" + file).replyWithFile(200,
        path.join(definitions, file));
  });
  nock(url).post("/vci/sdk").replyWithFile(200,
      path.join(__dirname, "integrityEx/retrieveVcIntegrityContent.xml"));

  const integrityService = await vsphere.integrityService(hostname, {
    definitions: ["/integrityService.wsdl"],
  });
  vspherex.integrityEx(integrityService);

  nock.cleanAll();
});

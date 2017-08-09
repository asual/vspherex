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
  counter: {
    args: 2,
    description: "Counter details in <host_name> <counter_name> format",
    key: "c",
    mandatory: true,
  },
  debug: {
    description: "Print debug details",
    key: "d",
  },
  hostname: {
    args: 1,
    description: "vSphere hostname",
    key: "h",
    mandatory: true,
  },
  insecure: {
    description: "Allow untrusted connections",
    key: "i",
  },
  password: {
    args: 1,
    description: "vSphere password",
    key: "p",
    mandatory: true,
  },
  username: {
    args: 1,
    description: "vSphere username",
    key: "u",
    mandatory: true,
  },
});

(async ({counter, debug,  hostname, insecure, password, username}) => {

  if (insecure) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  const vimService = await vsphere.vimService(hostname, {
    debug,
  });
  const vimEx = vspherex.vimEx(vimService);
  const {
    serviceContent: {
      perfManager,
      rootFolder,
      sessionManager,
    },
    vim,
    vimPort,
  } = vimService;
  await vimPort.login(sessionManager, username, password, null);
  const entities = await vimEx.retrieveEntities(rootFolder,
      vimEx.entity.HostSystem, 1, "name");
  const ref = entities.find(({props}) => props.name === counter[0]).ref;
  const metrics = await vimPort.queryAvailablePerfMetric(perfManager, ref,
      null, null, 20);
  const availableMetrics = metrics.filter((metric) =>
      !metric.instance.startsWith("host/")).reduce((previous, current) => {
        const {counterId} = current;
        previous[counterId] = [
          ...(previous[counterId] === undefined ? [] : previous[counterId]),
          current,
        ];
        return previous;
      }, []);
  const perfCounters = await vimPort.queryPerfCounter(perfManager,
      Object.keys(availableMetrics).map(Number));
  const perfCounter = perfCounters.filter(({groupInfo, nameInfo, rollupType}) =>
      counter[1] === `${groupInfo.key}.${nameInfo.key}.${rollupType}`)[0];
  const querySpec = vim.PerfQuerySpec({
    entity: ref,
    intervalId: 20,
    maxSample: 180,
    metricId: availableMetrics[perfCounter.key],
  });
  const perfStats: any = await vimPort.queryPerf(perfManager, [querySpec]);
  perfStats[0].value.forEach(({id, value}) => {
    console.log(util.format("%s[%s]\n%j\n", counter[1], id.instance, value));
  });

  await vimPort.logout(sessionManager);

})(opts);

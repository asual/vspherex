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

import {
  integrityService,
  vimService,
} from "vsphere";

const entity = {
  Alarm: "Alarm",
  AlarmManager: "AlarmManager",
  AuthorizationManager: "AuthorizationManager",
  CertificateManager: "CertificateManager",
  ClusterComputeResource: "ClusterComputeResource",
  ClusterEVCManager: "ClusterEVCManager",
  ClusterProfile: "ClusterProfile",
  ClusterProfileManager: "ClusterProfileManager",
  ComputeResource: "ComputeResource",
  ContainerView: "ContainerView",
  CryptoManager: "CryptoManager",
  CryptoManagerKmip: "CryptoManagerKmip",
  CustomFieldsManager: "CustomFieldsManager",
  CustomizationSpecManager: "CustomizationSpecManager",
  Datacenter: "Datacenter",
  Datastore: "Datastore",
  DatastoreNamespaceManager: "DatastoreNamespaceManager",
  DiagnosticManager: "DiagnosticManager",
  DistributedVirtualPortgroup: "DistributedVirtualPortgroup",
  DistributedVirtualSwitch: "DistributedVirtualSwitch",
  DistributedVirtualSwitchManager: "DistributedVirtualSwitchManager",
  EnvironmentBrowser: "EnvironmentBrowser",
  EventHistoryCollector: "EventHistoryCollector",
  EventManager: "EventManager",
  ExtensibleManagedObject: "ExtensibleManagedObject",
  ExtensionManager: "ExtensionManager",
  FailoverClusterConfigurator: "FailoverClusterConfigurator",
  FailoverClusterManager: "FailoverClusterManager",
  FileManager: "FileManager",
  Folder: "Folder",
  GuestAliasManager: "GuestAliasManager",
  GuestAuthManager: "GuestAuthManager",
  GuestFileManager: "GuestFileManager",
  GuestOperationsManager: "GuestOperationsManager",
  GuestProcessManager: "GuestProcessManager",
  GuestWindowsRegistryManager: "GuestWindowsRegistryManager",
  HealthUpdateManager: "HealthUpdateManager",
  HistoryCollector: "HistoryCollector",
  HostAccessManager: "HostAccessManager",
  HostActiveDirectoryAuthentication: "HostActiveDirectoryAuthentication",
  HostAuthenticationManager: "HostAuthenticationManager",
  HostAuthenticationStore: "HostAuthenticationStore",
  HostAutoStartManager: "HostAutoStartManager",
  HostBootDeviceSystem: "HostBootDeviceSystem",
  HostCacheConfigurationManager: "HostCacheConfigurationManager",
  HostCertificateManager: "HostCertificateManager",
  HostCpuSchedulerSystem: "HostCpuSchedulerSystem",
  HostDatastoreBrowser: "HostDatastoreBrowser",
  HostDatastoreSystem: "HostDatastoreSystem",
  HostDateTimeSystem: "HostDateTimeSystem",
  HostDiagnosticSystem: "HostDiagnosticSystem",
  HostDirectoryStore: "HostDirectoryStore",
  HostEsxAgentHostManager: "HostEsxAgentHostManager",
  HostFirewallSystem: "HostFirewallSystem",
  HostFirmwareSystem: "HostFirmwareSystem",
  HostGraphicsManager: "HostGraphicsManager",
  HostHealthStatusSystem: "HostHealthStatusSystem",
  HostImageConfigManager: "HostImageConfigManager",
  HostKernelModuleSystem: "HostKernelModuleSystem",
  HostLocalAccountManager: "HostLocalAccountManager",
  HostLocalAuthentication: "HostLocalAuthentication",
  HostMemorySystem: "HostMemorySystem",
  HostNetworkSystem: "HostNetworkSystem",
  HostPatchManager: "HostPatchManager",
  HostPciPassthruSystem: "HostPciPassthruSystem",
  HostPowerSystem: "HostPowerSystem",
  HostProfile: "HostProfile",
  HostProfileManager: "HostProfileManager",
  HostServiceSystem: "HostServiceSystem",
  HostSnmpSystem: "HostSnmpSystem",
  HostSpecificationManager: "HostSpecificationManager",
  HostStorageSystem: "HostStorageSystem",
  HostSystem: "HostSystem",
  HostVFlashManager: "HostVFlashManager",
  HostVMotionSystem: "HostVMotionSystem",
  HostVStorageObjectManager: "HostVStorageObjectManager",
  HostVirtualNicManager: "HostVirtualNicManager",
  HostVsanInternalSystem: "HostVsanInternalSystem",
  HostVsanSystem: "HostVsanSystem",
  HttpNfcLease: "HttpNfcLease",
  InventoryView: "InventoryView",
  IoFilterManager: "IoFilterManager",
  IpPoolManager: "IpPoolManager",
  IscsiManager: "IscsiManager",
  LicenseAssignmentManager: "LicenseAssignmentManager",
  LicenseManager: "LicenseManager",
  ListView: "ListView",
  LocalizationManager: "LocalizationManager",
  ManagedEntity: "ManagedEntity",
  ManagedObjectView: "ManagedObjectView",
  MessageBusProxy: "MessageBusProxy",
  Network: "Network",
  OpaqueNetwork: "OpaqueNetwork",
  OptionManager: "OptionManager",
  OverheadMemoryManager: "OverheadMemoryManager",
  OvfManager: "OvfManager",
  PbmCapabilityMetadataManager: "PbmCapabilityMetadataManager",
  PbmComplianceManager: "PbmComplianceManager",
  PbmPlacementSolver: "PbmPlacementSolver",
  PbmProfileProfileManager: "PbmProfileProfileManager",
  PbmProvider: "PbmProvider",
  PbmReplicationManager: "PbmReplicationManager",
  PbmServiceInstance: "PbmServiceInstance",
  PbmSessionManager: "PbmSessionManager",
  PerformanceManager: "PerformanceManager",
  Profile: "Profile",
  ProfileComplianceManager: "ProfileComplianceManager",
  ProfileManager: "ProfileManager",
  PropertyCollector: "PropertyCollector",
  PropertyFilter: "PropertyFilter",
  ResourcePlanningManager: "ResourcePlanningManager",
  ResourcePool: "ResourcePool",
  ScheduledTask: "ScheduledTask",
  ScheduledTaskManager: "ScheduledTaskManager",
  SearchIndex: "SearchIndex",
  ServiceInstance: "ServiceInstance",
  ServiceManager: "ServiceManager",
  SessionManager: "SessionManager",
  SimpleCommand: "SimpleCommand",
  StoragePod: "StoragePod",
  StorageResourceManager: "StorageResourceManager",
  Task: "Task",
  TaskHistoryCollector: "TaskHistoryCollector",
  TaskManager: "TaskManager",
  UserDirectory: "UserDirectory",
  VStorageObjectManagerBase: "VStorageObjectManagerBase",
  VcenterVStorageObjectManager: "VcenterVStorageObjectManager",
  View: "View",
  ViewManager: "ViewManager",
  VirtualApp: "VirtualApp",
  VirtualDiskManager: "VirtualDiskManager",
  VirtualMachine: "VirtualMachine",
  VirtualMachineCompatibilityChecker: "VirtualMachineCompatibilityChecker",
  VirtualMachineProvisioningChecker: "VirtualMachineProvisioningChecker",
  VirtualMachineSnapshot: "VirtualMachineSnapshot",
  VirtualizationManager: "VirtualizationManager",
  VmwareDistributedVirtualSwitch: "VmwareDistributedVirtualSwitch",
  VsanUpgradeSystem: "VsanUpgradeSystem"
};

const createTraversalSpec = (vim, name, path, type, ...names) => {
  return vim.TraversalSpec({
    name,
    path,
    selectSet: names.map((item) => vim.SelectionSpec({
      name: item
    })),
    type
  });
};

const createSelectSet = (vim) => {
  return [
    createTraversalSpec(vim, "visitFolders", "childEntity", entity.Folder,
        "visitFolders", "dcToHf", "dcToVmf", "dcToDs", "dcToNetf", "crToH",
        "crToRp", "hToVm", "rpToVm"),
    createTraversalSpec(vim, "rpToRp", "resourcePool", entity.ResourcePool,
        "rpToRp", "rpToVm"),
    createTraversalSpec(vim, "vAppToRp", "resourcePool", entity.VirtualApp,
        "rpToRp", "vAppToRp"),
    createTraversalSpec(vim, "dcToHf", "hostFolder", entity.Datacenter,
        "visitFolders"),
    createTraversalSpec(vim, "dcToVmf", "vmFolder", entity.Datacenter,
        "visitFolders"),
    createTraversalSpec(vim, "dcToDs", "datastoreFolder", entity.Datacenter,
        "visitFolders"),
    createTraversalSpec(vim, "dcToNetf", "networkFolder", entity.Datacenter,
        "visitFolders"),
    createTraversalSpec(vim, "crToH", "host", entity.ComputeResource),
    createTraversalSpec(vim, "crToRp", "resourcePool",
        entity.ComputeResource, "rpToRp", "rpToVm"),
    createTraversalSpec(vim, "hToVm", "vm", entity.HostSystem,
        "visitFolders"),
    createTraversalSpec(vim, "rpToVm", "vm", entity.ResourcePool)
  ];
};

const createProps = (propSet) => {
  return propSet.reduce((previous, current) => {
    let obj = previous;
    let path = current.name.split(".");
    let name = path.pop();
    while (path.length !== 0) {
        let entry = path.shift();
        if (obj[entry] === undefined) {
          obj[entry] = {};
        }
        obj = obj[entry];
    }
    obj[name] = obj[name] ? {
      ...obj[name],
      ...current.val
    } : current.val;
    return previous;
  }, {}) as any;
};

const retrieveEntities = async (vim, vimPort, propertyCollector, ref, type,
    limit, ...props) => {
  let result = await vimPort.retrievePropertiesEx(propertyCollector, [
    vim.PropertyFilterSpec({
      objectSet: [
        vim.ObjectSpec({
          obj: ref,
          selectSet: createSelectSet(vim)
        })
      ],
      propSet: [
        vim.PropertySpec({
          all: props.length === 0,
          pathSet: props,
          type
        })
      ]
    })
  ], vim.RetrieveOptions(limit === undefined ? {} : {
    maxObjects: limit
  }));
  while (result.token !== undefined) {
    result = await vimPort.continueRetrievePropertiesEx(propertyCollector,
      result.token);
    result.objects = result.objects.concat(result.objects);
  }
  return result.objects.map((object) => ({
    props: createProps(object.propSet),
    ref: object.obj
  }));
};

const retrieveProperty = async (vim, vimPort, propertyCollector,
    ref, prop) => {
  const result = await vimPort.retrievePropertiesEx(propertyCollector, [
    vim.PropertyFilterSpec({
      objectSet: [
        vim.ObjectSpec({
          obj: ref
        })
      ],
      propSet: [
        vim.PropertySpec({
          pathSet: [
            prop
          ],
          type: ref.type,
        })
      ]
    })
  ], vim.RetrieveOptions());
  return result.objects[0].propSet[0].val;
};

const retrieveProperties = async (vim, vimPort, propertyCollector,
    ref, ...props) => {
  const result = await vimPort.retrievePropertiesEx(propertyCollector, [
    vim.PropertyFilterSpec({
      objectSet: [
        vim.ObjectSpec({
          obj: ref
        })
      ],
      propSet: [
        vim.PropertySpec({
          all: props.length === 0,
          pathSet: props,
          type: ref.type,
        })
      ]
    })
  ], vim.RetrieveOptions());
  return createProps(result.objects[0].propSet);
};

const retrieveReferences = async (vim, vimPort, propertyCollector, ref,
    type, limit) => {
  let result = await vimPort.retrievePropertiesEx(propertyCollector, [
    vim.PropertyFilterSpec({
      objectSet: [
        vim.ObjectSpec({
          obj: ref,
          selectSet: createSelectSet(vim)
        })
      ],
      propSet: [
        vim.PropertySpec({
          type
        })
      ]
    })
  ], vim.RetrieveOptions(limit === undefined ? {} : {
    maxObjects: limit
  }));
  while (result.token !== undefined) {
    result = await vimPort.continueRetrievePropertiesEx(propertyCollector,
      result.token);
    result.objects = result.objects.concat(result.objects);
  }
  return result.objects.map((object) => object.obj);
};

const waitForTask = async (vim, vimPort, propertyCollector, ref) => {
  const INFO_ERROR = "info.error";
  const INFO_STATE = "info.state";
  let filter = await vimPort.createFilter(propertyCollector,
      vim.PropertyFilterSpec({
        objectSet: [
          vim.ObjectSpec({
            obj: ref
          })
        ],
        propSet: [
          vim.PropertySpec({
            pathSet: [INFO_ERROR, INFO_STATE],
            type: ref.type,
          })
        ]
      }), true);
  let version = "";
  let waiting = true;
  while (waiting) {
    const updateSet = await vimPort.waitForUpdatesEx(propertyCollector,
      version, null);
    version = updateSet.version;
    updateSet.filterSet.
      filter(({filter: {value}}) => value === filter.value).
      reduce((previous, {objectSet}) => [...previous, ...objectSet], []).
      reduce((previous, {changeSet}) => [...previous, ...changeSet], []).
      forEach(({name, val}) => {
        if (name === INFO_ERROR && val !== undefined) {
          throw Error(val.localizedMessage);
        }
        if (name === INFO_STATE && val === vim.TaskInfoState.success) {
          waiting = false;
        }
      });
  }
  await vimPort.destroyPropertyFilter(filter);
};

export const integrityEx = (integrityService: integrityService) => {
  type ManagedObjectReference = integrityService.vim.ManagedObjectReference;
  const {
    serviceContent: {
      propertyCollector
    },
    vim,
    integrityPort
  } = integrityService;
  return {
    entity,
    retrieveEntities: async (ref: ManagedObjectReference, type: string,
        limit: number, ...props: string[]) => {
      return retrieveEntities(vim, integrityPort, propertyCollector, ref, type,
          limit, ...props);
    },
    retrieveProperties: async (ref: ManagedObjectReference,
        ...props: string[]) => {
      return retrieveProperties(vim, integrityPort, propertyCollector, ref,
          ...props);
    },
    retrieveProperty: async (ref: ManagedObjectReference, prop: string) => {
      return retrieveProperty(vim, integrityPort, propertyCollector, ref, prop);
    },
    retrieveReferences: async (ref: ManagedObjectReference, type: string,
        limit?: number) => {
      return retrieveReferences(vim, integrityPort, propertyCollector, ref,
          type, limit);
    },
    waitForTask: async (ref: ManagedObjectReference) => {
      await waitForTask(vim, integrityPort, propertyCollector, ref);
    }
  };
};

export const vimEx = (vimService: vimService) => {
  type ManagedObjectReference = vimService.vim.ManagedObjectReference;
  const {
    serviceContent: {
      propertyCollector
    },
    vim,
    vimPort
  } = vimService;
  return {
    entity,
    retrieveEntities: async (ref: ManagedObjectReference, type: string,
        limit: number, ...props: string[]) => {
      return retrieveEntities(vim, vimPort, propertyCollector, ref, type,
          limit, ...props);
    },
    retrieveProperties: async (ref: ManagedObjectReference,
        ...props: string[]) => {
      return retrieveProperties(vim, vimPort, propertyCollector, ref, ...props);
    },
    retrieveProperty: async (ref: ManagedObjectReference, prop: string) => {
      return retrieveProperty(vim, vimPort, propertyCollector, ref, prop);
    },
    retrieveReferences: async (ref: ManagedObjectReference, type: string,
      limit?: number) => {
      return retrieveReferences(vim, vimPort, propertyCollector, ref, type,
          limit);
    },
    waitForTask: async (ref: ManagedObjectReference) => {
      await waitForTask(vim, vimPort, propertyCollector, ref);
    }
  };
};

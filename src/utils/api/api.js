import { ApiManager } from './apiManager';
import config from '../../config';

const apigw = new ApiManager({ endpoint: config.apiGwEndpoint });

function queryFromObject(input = {}, leadingMark = false) {
  const entries = Object.entries(input);
  const finalEntries = [];
  // transform array values to key[] format
  entries.forEach(([k, v]) => {
    if (Array.isArray(v)) {
      finalEntries.push(...v.map((value) => [`${k}[]`, value]));
    } else {
      finalEntries.push([k, v]);
    }
  });

  let result = finalEntries.map((e) => e.join('=')).join('&');
  if (leadingMark && result.length > 0) {
    result = `?${result}`;
  }
  return result;
}

const EP_CONFIG = {
  accounts: {
    gw_path: 'users-service-api',
    gw_entity_name: 'accounts',
  },
  modules: {
    gw_path: 'users-service-api',
    gw_entity_name: 'modules',
  },
  roles: {
    gw_path: 'users-service-api',
    gw_entity_name: 'roles',
  },
  users: {
    gw_path: 'users-service-api',
    gw_entity_name: 'users',
  },
  groups: {
    gw_path: 'users-service-api',
    gw_entity_name: 'groups',
  },
  videos: {
    gw_path: 'main-api',
    gw_entity_name: 'videos',
  },
};

class _ResourceManagerImpl {
  constructor(resourceConfig) {
    this._config = resourceConfig;
  }

  get config() {
    return this._config;
  }

  get entityName() {
    const { gw_entity_name } = this.config;
    return gw_entity_name;
  }

  get basePath() {
    const { gw_path, gw_entity_name } = this.config;
    return `/${gw_path}/${gw_entity_name}`;
  }

  pathWithId(id) {
    return `${this.basePath}/${id}`;
  }

  async create(data) {
    return apigw.post(this.basePath, data);
  }

  async findAll(params = {}) {
    const query = queryFromObject(params, true);
    return apigw.get(`${this.basePath}${query}`);
  }

  async find(id) {
    return apigw.get(this.pathWithId(id));
  }

  async update(id, data) {
    return apigw.put(this.pathWithId(id), data);
  }

  async delete(id) {
    return apigw.del(this.pathWithId(id));
  }
}

class ResourceManager extends _ResourceManagerImpl {
  constructor(...args) {
    super(...args);
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.find = this.find.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(data) {
    return super.create(data);
  }

  async findAll(params) {
    return super.findAll(params);
  }

  async find(id) {
    return super.find(id);
  }

  async update(id, data) {
    return super.update(id, data);
  }

  async delete(id) {
    return super.delete(id);
  }
}

export async function fetchAdminPayload() {
  const payload = await apigw.get('/main-api/common/admin-payload');
  return payload;
}

export const AuthAPI = {
  login(data) {
    return apigw.post('/users-service-api/auth/login', data);
  },
  logout() {
    return apigw.del('/users-service-api/auth/logout');
  },
};
export const VideosAPI = new ResourceManager(EP_CONFIG.videos);

export const GroupsAPI = new ResourceManager(EP_CONFIG.groups);
GroupsAPI.findAccount = function (id) {
  return apigw.get(`${this.pathWithId(id)}/accounts`).then((accounts) => accounts[0] || null);
};
GroupsAPI.findRoles = function (id) {
  return apigw.get(`${this.pathWithId(id)}/roles`);
};
GroupsAPI.findUsers = function (id) {
  return apigw.get(`${this.pathWithId(id)}/users`);
};

export const UsersAPI = new ResourceManager(EP_CONFIG.users);
UsersAPI.findGroups = function (id) {
  return apigw.get(`${this.pathWithId(id)}/groups`);
};
UsersAPI.fetchMe = function (headers) {
  return apigw.get(`${this.basePath}/me`, headers);
};
UsersAPI.fetchContext = function (headers) {
  return apigw.get(`${this.basePath}/me/context`, headers);
};
UsersAPI.updateSelf = function (data) {
  return apigw.put(`${this.basePath}/me`, data);
};

// do not use until backend has query implemented
UsersAPI.getUsers = function (queries) {
  return apigw.get(`${this.basePath}?${queryFromObject(queries)}`);
};
UsersAPI.import = function (data) {
  return apigw.post(`${this.basePath}/import`, data);
};
UsersAPI.resetPasswword = function (data) {
  return apigw.post(`${this.basePath}/reset-password`, data);
};
UsersAPI.changePasswword = function (data) {
  return apigw.post(`${this.basePath}/change-password`, data);
};

export const AccountsAPI = new ResourceManager(EP_CONFIG.accounts);
AccountsAPI.findModules = function (id) {
  return apigw.get(`${this.pathWithId(id)}/modules`);
};
AccountsAPI.findGroups = function (id) {
  return apigw.get(`${this.pathWithId(id)}/groups`);
};
AccountsAPI.findUsers = function (id) {
  // First, fetch all account's groups
  return this.findGroups(id)
    .then((groups) =>
      // Fetch users for all groups
      Promise.all(
        groups.map(async (group) => {
          const groupUsers = await GroupsAPI.findUsers(group.id);
          return groupUsers.map((user) => {
            return { ...user, group };
          });
        }),
      ),
    )
    .then((usersArrays) => {
      // build a id => user map to merge and remove duplicates
      const allUsersById = usersArrays.reduce((acc, usersArray) => {
        usersArray.forEach((user) => {
          acc[user.id] = user;
        });
        return acc;
      }, {});
      // return only values
      return Object.values(allUsersById);
    });
};

export const IssuersAPI = new ResourceManager(EP_CONFIG.issuers);

export const IssuersTypesAPI = new ResourceManager(EP_CONFIG.issuerTypes);

export const NewsTypesAPI = new ResourceManager(EP_CONFIG.newsTypes);

export const NewsAPI = new ResourceManager(EP_CONFIG.news);
NewsAPI.sendNotif = function (newsId, payload) {
  return apigw.post(`${this.basePath}/${newsId}/notifications`, payload);
};

export const PerformancesAPI = new ResourceManager(EP_CONFIG.performances);
PerformancesAPI.upload = function (data) {
  return apigw.post(`${this.basePath}/addlist`, data);
};
PerformancesAPI.getDates = function () {
  return apigw.get(`${this.basePath}/dateupload`);
};

export const WarrenAuthAPI = new ResourceManager(EP_CONFIG.authentication);
WarrenAuthAPI.renewOne = function (id) {
  return apigw.post(`${this.basePath}/renew`, { userId: id });
};
WarrenAuthAPI.renewAll = function (ids) {
  return apigw.post(`${this.basePath}/renew`, { userIds: ids });
};

export const PerformanceTypesAPI = new ResourceManager(EP_CONFIG.performanceTypes);
PerformanceTypesAPI.init = function () {
  return apigw.post(`${this.basePath}/init`, {});
};

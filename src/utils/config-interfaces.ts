export interface IDefault {
  service: {
    name: string;
    port: number;
    basePath: string;
    databases: {
      main: {
        dialect: string;
        host: string;
        port: number;
        dbName: string;
        user: string;
        password: string;
      };
    };
    jwt: {
      client_id: string;
      encryption: string;
      expiration: string;
      refresh_token: {
        expiration: string;
        encryption: string;
      };
    };
    auth: {
      salt: string;
    };
    external: {
      marvelApi: {
        url: string;
        apiKey: string;
        hash: string;
        ts: number;
      };
    };
  };
  metadata: {
    enviroment: string;
    cookie: {
      domain: '';
      sameSite: string;
      httpOnly: string;
    };
  };
}

export interface IConfig {
  default: IDefault;
}

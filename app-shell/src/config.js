

const config = {
  admin_pass: "48cf84c4",
  admin_email: "admin@flatlogic.com",
  schema_encryption_key: process.env.SCHEMA_ENCRYPTION_KEY || '',

  project_uuid: '48cf84c4-8bee-4f47-8c91-01804ab3ab92',
  flHost: process.env.NODE_ENV === 'production' ? 'https://flatlogic.com/projects' : 'http://localhost:3000/projects',

  gitea_domain: process.env.GITEA_DOMAIN || 'gitea.flatlogic.app',
  gitea_username: process.env.GITEA_USERNAME || 'admin',
  gitea_api_token: process.env.GITEA_API_TOKEN || null,
  github_repo_url: process.env.GITHUB_REPO_URL || null,
  github_token: process.env.GITHUB_TOKEN || null,
};

module.exports = config;

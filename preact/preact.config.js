import envVars from 'preact-cli-plugin-env-vars';

export default function (config, env, helpers) {
  config.node = { fs: 'empty'};
  envVars(config, env, helpers);
}

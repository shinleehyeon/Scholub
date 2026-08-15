export const getEnvironment = () => {
  return process.env.NODE_ENV || 'local';
};

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

export function isLocal() {
  return process.env.NODE_ENV === 'local';
}

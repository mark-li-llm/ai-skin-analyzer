/**
 * JWT 工具函数
 * 用于密码保护功能的 token 生成和验证
 */

/**
 * 获取 JWT 签名密钥
 * @returns Uint8Array 格式的密钥（jose 库要求）
 * @throws Error 如果 JWT_SECRET 未配置
 */
export function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }

  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  return new TextEncoder().encode(secret);
}

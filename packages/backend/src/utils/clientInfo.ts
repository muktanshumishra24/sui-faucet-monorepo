import { Request } from 'express';
import geoip from 'geoip-lite';
import UAParser from 'ua-parser-js';
import { GeolocationInfo, UserAgentInfo, RequestContext } from '../types';

export const getClientInfo = (req: Request): RequestContext => {
  // Extract IP address
  const forwarded = req.headers['x-forwarded-for'];
  const ip = Array.isArray(forwarded) 
    ? forwarded[0] 
    : forwarded?.split(',')[0] || req.ip || 'unknown-ip';

  // Get user agent
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Parse geolocation
  const geolocation = getGeolocation(ip);

  // Parse user agent
  const userAgentInfo = getUserAgentInfo(userAgent);

  return {
    ip,
    userAgent,
    geolocation,
    userAgentInfo,
  };
};

export const getGeolocation = (ip: string): GeolocationInfo | undefined => {
  try {
    if (ip === 'unknown-ip' || ip === '127.0.0.1' || ip === '::1') {
      return undefined;
    }

    const geo = geoip.lookup(ip);
    if (!geo) {
      return undefined;
    }

    return {
      country: geo.country || 'Unknown',
      region: geo.region || 'Unknown',
      city: geo.city || 'Unknown',
      timezone: geo.timezone || 'Unknown',
      ip,
    };
  } catch (error) {
    return undefined;
  }
};

export const getUserAgentInfo = (userAgent: string): UserAgentInfo => {
  try {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    return {
      browser: result.browser.name || 'Unknown',
      version: result.browser.version || 'Unknown',
      os: result.os.name || 'Unknown',
      device: result.device.type || 'desktop',
      isBot: isBot(userAgent),
    };
  } catch (error) {
    return {
      browser: 'Unknown',
      version: 'Unknown',
      os: 'Unknown',
      device: 'desktop',
      isBot: isBot(userAgent),
    };
  }
};

export const isBot = (userAgent: string): boolean => {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /node/i,
    /postman/i,
    /insomnia/i,
    /thunder client/i,
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
};

export const getClientFingerprint = (req: Request): string => {
  const clientInfo = getClientInfo(req);
  
  // Create a simple fingerprint based on IP and user agent
  const fingerprint = `${clientInfo.ip}-${clientInfo.userAgentInfo?.browser}-${clientInfo.userAgentInfo?.os}`;
  
  return fingerprint;
}; 
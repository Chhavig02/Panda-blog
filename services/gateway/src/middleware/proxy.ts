import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { logger } from '../utils/logger';

export const proxyRequest = (targetUrl: string) => {
  return async (req: Request, res: Response) => {
    try {
      const url = `${targetUrl}${req.originalUrl}`;
      const method = req.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';

      const config: any = {
        method,
        url,
        headers: {
          ...req.headers,
          host: undefined,
          'content-type': req.headers['content-type'] || 'application/json',
        },
        data: req.body,
        params: req.query,
      };

      // Forward user info if available
      if (req.headers['x-user-id']) {
        config.headers['x-user-id'] = req.headers['x-user-id'];
      }
      if (req.headers['x-user-email']) {
        config.headers['x-user-email'] = req.headers['x-user-email'];
      }

      const response = await axios(config);

      res.status(response.status).json(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        res.status(axiosError.response.status).json(axiosError.response.data);
      } else {
        logger.error('Proxy error:', error);
        res.status(500).json({
          success: false,
          message: 'Service unavailable',
        });
      }
    }
  };
};


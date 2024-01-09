import { Request, Response, NextFunction } from 'express';

const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default asyncMiddleware;


// module.exports = (fn) => {
//     return (req, res, next) => {
//       fn(req, res, next).catch(next);
//     };
//   };
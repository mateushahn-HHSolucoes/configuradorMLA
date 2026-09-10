import { HttpInterceptorFn } from '@angular/common/http';

export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const credenciais = btoa('tasy:tasy');

  const reqComAuth = req.clone({
    setHeaders: { Authorization: `Basic ${credenciais}` }
  });

  return next(reqComAuth);
};
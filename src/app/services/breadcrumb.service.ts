import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.createBreadcrumbs(
          this.router.routerState.snapshot.root,
          ''
        );
        this.breadcrumbsSubject.next(breadcrumbs);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRouteSnapshot,
    currentUrl: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    if (route.routeConfig && route.routeConfig.path) {
      currentUrl += `/${route.routeConfig.path}`;
    }

    if (route.data['breadcrumb']) {
      breadcrumbs.push({ label: route.data['breadcrumb'], url: currentUrl });
    }

    return route.firstChild
      ? this.createBreadcrumbs(route.firstChild, currentUrl, breadcrumbs)
      : breadcrumbs;
  }
}

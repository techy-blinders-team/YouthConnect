import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [

    // Public Website Routing
    {
        path: '',
        loadComponent: () => 
            import('./pages/landing-page/landing-page').
            then(move => move.LandingPage),
    },

    {
        path: 'about',
        loadComponent: () => 
            import('./pages/about-page/about-page').then(move => move.AboutPage),
    },

    {
        path: 'leaders',
        loadComponent: () =>
            import('./pages/leaders-page/leaders-page').then(move => move.LeadersPage),
    },

    {
        path: 'projects',
        loadComponent: () =>
            import ('./pages/projects-page/projects-page').then(move => move.ProjectsPage),
    },


    // Authentication Route
    {
        path: 'login',
        loadComponent: () =>
            import ('./pages/login-page/login-page').then (move => move.LoginPage),
    },

    {
        path: 'sign-up',
        loadComponent: () =>
            import ('./pages/sign-up-page/sign-up-page').then (move => move.SignUpPage),
    },


    // User Role Youth Route
    {
        path: 'youth',
        canActivate: [authGuard, roleGuard],
        data: {roles: ['youth']},
        children: [ 
            {
            path: 'dashboard',
            loadComponent: () =>
                import('./pages/youth-user-page/dashboard/dashboard').then (move => move.Dashboard),
            },
            {
                path: 'create-concern',
                loadComponent: () => 
                    import ('./pages/youth-user-page/create-concern/create-concern').then (move => move.CreateConcern),
            },
            {
                path: 'events',
                loadComponent: () =>
                    import ('./pages/youth-user-page/events/events').then (move => move.Events),
            },
            {
                path: 'notifications',
                loadComponent: () =>
                    import ('./pages/youth-user-page/notification/notification').then (move => move.Notification),
            },
            {
                path: '', redirectTo: 'dashboard', pathMatch: 'full'
            },
        
        ],
    },

    //SK Official Route
    {
        path: 'sk-official',
        canActivate: [authGuard, roleGuard],
        data: {roles: ['sk-official']},
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/sk-official-page/sk-official-dashboard/sk-official-dashboard').then (move => move.SkOfficialDashboard),
            },

            {
                path: 'concerns',
                loadComponent: () =>
                    import('./pages/sk-official-page/concerns/concerns').then (move => move.Concerns),
            },

            {
                path: 'create-event',
                loadComponent: () => 
                    import('./pages/sk-official-page/create-event/create-event').then (move => move.CreateEvent),
            },

            {
                path: 'manage-event',
                loadComponent: () =>
                    import('./pages/sk-official-page/manage-event/manage-event').then (move => move.ManageEvent),
            },

            {
                path: 'profiling',
                loadComponent: () =>
                    import ('./pages/sk-official-page/manage-profiling/manage-profiling').then (move => move.ManageProfiling),
            },

            {
                path: 'task-trakcer',
                loadComponent: () =>
                    import ('./pages/sk-official-page/task-tracker/task-tracker').then (move => move.TaskTracker),
            },
            { 
                path: '', redirectTo: 'dashboard', pathMatch: 'full' 
            },

        ],
    },

    //Admin Route
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: {roles: ['admin']},
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./pages/administrator-page/administrator-dashboard/administrator-dashboard').then (move => move.AdministratorDashboard),
            },
            {
                path: 'backup-restore',
                loadComponent: () =>
                    import ('./pages/administrator-page/backup-restore/backup-restore').then (move => move.BackupRestore),
            },
            {
                path: 'manage-sk-officials',
                loadComponent: () =>
                    import('./pages/administrator-page/manage-sk-officials/manage-sk-officials').then (move => move.ManageSkOfficials),
            },
            {
                path: 'manage-youth-member',
                loadComponent: () =>
                    import('./pages/administrator-page/manage-youth-member/manage-youth-member').then (move => move.ManageYouthMember),
            },
            {
                path: 'system-control',
                loadComponent: () =>
                    import ('./pages/administrator-page/system-control/system-control').then (move => move.SystemControl),
            },
            {
                path: 'system-statics',
                loadComponent: () => 
                    import ('./pages/administrator-page/system-statistics/system-statistics').then (move => move.SystemStatistics),
            },
            { 
                path: '', redirectTo: 'dashboard', pathMatch: 'full' 
            },
        ],
    },

];

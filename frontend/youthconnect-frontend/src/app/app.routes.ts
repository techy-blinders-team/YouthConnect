import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { AboutPage } from './pages/about-page/about-page';
import { LeadersPage } from './pages/leaders-page/leaders-page';
import { ProjectsPage } from './pages/projects-page/projects-page';
import { LoginPage } from './pages/login-page/login-page';
import { SignUpPage } from './pages/sign-up-page/sign-up-page';
import { Dashboard } from './pages/youth-user-page/dashboard/dashboard';
import { CreateConcern } from './pages/youth-user-page/create-concern/create-concern';
import { Events } from './pages/youth-user-page/events/events';
import { Concerns } from './pages/sk-official-page/concerns/concerns';
import { CreateEvent } from './pages/sk-official-page/create-event/create-event';
import { SkOfficialDashboard } from './pages/sk-official-page/sk-official-dashboard/sk-official-dashboard';
import { ManageEvent } from './pages/sk-official-page/manage-event/manage-event';
import { ManageProfiling } from './pages/sk-official-page/manage-profiling/manage-profiling';
import { SkOfficialLogin } from './pages/sk-official-page/sk-official-login/sk-official-login';
import { TaskTracker } from './pages/sk-official-page/task-tracker/task-tracker';
import { BackupRestore } from './pages/administrator-page/backup-restore/backup-restore';
import { AdministratorPage } from './pages/administrator-page/administrator-page/administrator-page';
import { ManageAdministrators } from './pages/administrator-page/manage-administrators/manage-administrators';
import { ManageSkOfficials } from './pages/administrator-page/manage-sk-officials/manage-sk-officials';
import { ManageYouthMember } from './pages/administrator-page/manage-youth-member/manage-youth-member';
import { SystemControl } from './pages/administrator-page/system-control/system-control';
import { SystemStatistics } from './pages/administrator-page/system-statistics/system-statistics';

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

    {
        path: 'sk-official-login',
        loadComponent: () => 
            import ('./pages/sk-official-page/sk-official-login/sk-official-login').then (move => move.SkOfficialLogin),
    },

    

];

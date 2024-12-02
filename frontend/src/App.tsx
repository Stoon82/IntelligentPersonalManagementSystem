import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from 'components/layout/Layout';
import { Dashboard } from 'pages/Dashboard';
import { Projects } from 'pages/Projects';
import { ProjectDetail } from 'pages/ProjectDetail';
import { Tasks } from 'pages/Tasks';
import { Ideas } from 'pages/Ideas';
import { Profile } from 'pages/Profile';
import UserContent from 'pages/UserContent';
import { Login } from 'components/auth/Login';
import { Register } from 'components/auth/Register';
import { useAuth } from 'contexts/AuthContext';

function App() {
    const { user } = useAuth();

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Layout><Outlet /></Layout>}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="ideas" element={<Ideas />} />
                <Route path="content" element={<UserContent />} />
                <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;

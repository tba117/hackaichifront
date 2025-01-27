import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得

    if (!token) {
        // トークンが存在しない場合、ログイン画面にリダイレクト
        console.log('トークン無')
        return <Navigate to="/login" />;
    }

    console.log('トークン有')

    // トークンが存在する場合、子コンポーネントを表示
    return children;
};

export default AuthGuard;

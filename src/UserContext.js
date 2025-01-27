import React, { createContext, useState, useEffect } from 'react';

// UserContext の作成
export const UserContext = createContext();

// UserProvider コンポーネント
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [matchedUser, setMatchedUser] = useState(null);

    // アプリ初回ロード時に localStorage からユーザー情報を取得
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedMatchedUser = localStorage.getItem('matchedUserData');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedMatchedUser) {
            setMatchedUser(JSON.parse(storedMatchedUser));
        }
    }, []);

    // ユーザー情報を保存する関数
    const saveUser = (userData) => {
        setUser(userData); // 状態を更新
        localStorage.setItem('user', JSON.stringify(userData)); // localStorage に保存
    };

    // ユーザー情報を削除する関数（ログアウト時）
    const clearUser = () => {
        setUser(null); // 状態をクリア
        localStorage.removeItem('user'); // localStorage から削除
        localStorage.removeItem('matchedUserData');
    };

    // ユーザー情報を保存する関数
    const saveMatchedUser = (matchedUserData) => {
        setMatchedUser(matchedUserData); // 状態を更新
        localStorage.setItem('matchedUserData', JSON.stringify(matchedUserData)); // localStorage に保存
    };

    return (
        <UserContext.Provider value={{ user, matchedUser, saveUser, clearUser, saveMatchedUser }}>
            {children}
        </UserContext.Provider>
    );
};

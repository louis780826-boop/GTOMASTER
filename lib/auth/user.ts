export type UserRole = "guest" | "free" | "premium";

export interface User {
  username: string;
  role: UserRole; // free / premium
  dailyLimit: number; // 當日剩餘練習題數
  lastActive: string; // 用來紀錄每日 reset
}

// 預設：未登入用戶視為 guest
export const getCurrentUser = (): User => {
  if (typeof window === "undefined") {
    return { username: "", role: "guest", dailyLimit: 0, lastActive: "" };
  }

  const raw = localStorage.getItem("gtoUser");
  if (!raw) {
    return { username: "", role: "guest", dailyLimit: 0, lastActive: "" };
  }

  const user: User = JSON.parse(raw);

  // 每日重置 free 會員題數
  const today = new Date().toDateString();
  if (user.role === "free" && user.lastActive !== today) {
    user.dailyLimit = 3;
    user.lastActive = today;
    localStorage.setItem("gtoUser", JSON.stringify(user));
  }

  return user;
};

export const saveUser = (user: User) => {
  localStorage.setItem("gtoUser", JSON.stringify(user));
};

// 註冊（預設 free 會員）
export const registerUser = (username: string, password: string) => {
  const newUser: User = {
    username,
    role: "free",
    dailyLimit: 3,
    lastActive: new Date().toDateString(),
  };

  localStorage.setItem("gtoUser", JSON.stringify(newUser));
  return newUser;
};

// 登入（demo 版）
export const loginUser = (username: string, password: string) => {
  const user: User = {
    username,
    role: "free",
    dailyLimit: 3,
    lastActive: new Date().toDateString(),
  };

  localStorage.setItem("gtoUser", JSON.stringify(user));
  return user;
};

// 升級成 Premium
export const upgradeToPremium = () => {
  const user = getCurrentUser();
  user.role = "premium";
  user.dailyLimit = 999999;
  localStorage.setItem("gtoUser", JSON.stringify(user));
  return user;
};

// 登出
export const logoutUser = () => {
  localStorage.removeItem("gtoUser");
};

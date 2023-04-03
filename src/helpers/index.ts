export const afterTokenExpire = (e, history, clearUserData) => {
    if (e?.response?.data?.error === "Unauthorized User." && e?.response?.data?.reason === "Token Expired.") {
        clearUserData?.();
        history?.replace?.("/login");
    }
};

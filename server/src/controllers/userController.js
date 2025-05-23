const db = require("../models/db_users");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log("로그인 axios 요청 도착")
    console.log("로그인 axios 로 받은 email은, ", email)
    console.log("로그인 axios 로 받은 password는, ", password)

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        console.log("DB 쿼리 결과: ", rows)
        // 구조 분해 할당..? ㅎㅎ; 
        
        const user = rows[0];
        
    if (!user) {
        console.log("이메일 없을때 뜨는 디버그. 사용자 없습니다.")
        return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
    }

    console.log("DB 상 비밀번호: ", user.password);
    console.log("입력된 비밀번호: ", password);

    if (user.password.trim() !== password.trim()) {
        console.log("비밀번호 불일치")
        return res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
    }

    const token = jwt.sign(
        {   id: user.user_id,
            email: user.email, 
            name: user.name, 
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: "2h" }
    );

    res.status(200).json({ message: "로그인 성공", token });
    } catch (error) {
    console.error("로그인 실패:", error);
    res.status(500).json({ message: "서버 에러" });
    }
};

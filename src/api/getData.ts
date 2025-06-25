import type {AttendanceDataMap} from "../types/AttendanceType.ts";

const ENDPOINT = "https://api.github.com/graphql";
const TOKEN = import.meta.env.VITE_API_TOKEN;

console.log(`TEST TOKEN : ${TOKEN}.`);

export async function getCurrentPRData(): Promise<AttendanceDataMap> {
    const query = `
    {
      repository(owner: "kucdas-koreauniv", name: "kucdas-algorithm") {
        pullRequests(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            number
            title
            state
            url
            author {
              login
            }
            createdAt
            updatedAt
            baseRefName
            headRefName
          }
        }
      }
    }`;

    const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();
    const pullRequests = result.data.repository.pullRequests.nodes;

    const attendanceData: AttendanceDataMap = {};

    const MAX_WEEK = pullRequests.reduce((prev:number, pr: any) => {
        const { title } = pr;
        const match = title.toUpperCase().match(/\[WEEK(\d+)\]/); // [Wn] 형식 추출
        if (match) {
            const weekIndex = parseInt(match[1], 10);
            if (weekIndex > prev) {
                return weekIndex; // 최대 주차 업데이트
            }
        }
        return prev;
    }, 15);

    pullRequests.forEach((pr: any) => {
        const { title, url, createdAt, author } = pr;
        const match = title.toUpperCase().match(/\[WEEK(\d+)\]/); // [Wn] 형식 추출
        console.log(match);
        if (match) {
            const weekIndex = parseInt(match[1], 10) - 1; // 주차를 0 기반 인덱스로 변환
            const login = author.login;

            if (!attendanceData[login]) {
                attendanceData[login] = Array(MAX_WEEK).fill(null); // 15주차 배열 초기화
            }

            attendanceData[login][weekIndex] = {
                name: login,
                link: url,
                date: createdAt,
                title: title,
            };
        }
    });

    console.log(attendanceData);
    return attendanceData;
}
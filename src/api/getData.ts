import type { AttendanceDataMap } from "../types/AttendanceType.ts";

const ENDPOINT = "https://api.github.com/graphql";
const TOKEN = import.meta.env.VITE_API_TOKEN;

const MAX_WEEK_DEFAULT = 15;

export async function getCurrentPRData(): Promise<AttendanceDataMap> {
    const attendanceData: AttendanceDataMap = {};
    let hasNextPage = true;
    let afterCursor: string | null = null;
    let maxWeek = MAX_WEEK_DEFAULT;

    while (hasNextPage) {
        const query = `
      query ($after: String) {
        repository(owner: "kucdas-koreauniv", name: "kucdas-algorithm") {
          pullRequests(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, after: $after) {
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
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }`;

        const variables = { after: afterCursor };

        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const pullRequests = result.data.repository.pullRequests.nodes;
        const pageInfo = result.data.repository.pullRequests.pageInfo;

        for (const pr of pullRequests) {
            if (!pr.author) continue;

            const match = pr.title.toUpperCase().match(/\[WEEK(\d+)\]/);
            if (!match) continue;

            const weekIndex = parseInt(match[1], 10);
            if (weekIndex > maxWeek) maxWeek = weekIndex;

            const zeroBasedWeek = weekIndex - 1;
            const login = pr.author.login;

            if (!attendanceData[login]) {
                attendanceData[login] = Array(MAX_WEEK_DEFAULT).fill(null);
            }
            attendanceData[login][zeroBasedWeek] = {
                name: login,
                link: pr.url,
                date: pr.createdAt,
                title: pr.title,
            };
        }

        hasNextPage = pageInfo.hasNextPage;
        afterCursor = pageInfo.endCursor;
    }

    // attendanceData 배열 길이 실제 maxWeek에 맞게 늘리기
    Object.values(attendanceData).forEach(arr => {
        if (arr.length < maxWeek) {
            arr.push(...Array(maxWeek - arr.length).fill(null));
        }
    });

    return attendanceData;
}

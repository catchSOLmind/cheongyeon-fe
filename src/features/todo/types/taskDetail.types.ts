// 할일 상세 조회
export interface TaskDetailResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: TaskDetail;
}

// 할일 목록 수정 시 기존의 TaskDetail 받아옴
export interface TaskDetail {
        occurrenceId: number;
        taskId: number;
        groupId: number;
        taskType: TaskType;
        date: string;
        time: string;
        repeat: Repeat;
        assignee: Assignee;
        status: string;
    }

export interface TaskType {
    taskTypeId: number;
    category: string;
    name: string;
}

export interface Repeat {
    enabled: boolean;
    daysOfWeek: string[];
}

export interface Assignee {
    memberId: number;
    nickname: string;
    profileImageUrl: string;
}
import { configs } from "../configs/configs";
import { IUser } from "../types";

export class UserMapper {
    public toResponse(user: IUser) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            avatar: user.avatar ? `${configs.AWS_S3_BUCKET_URL}/${user.avatar}` : null
        };
    }

    public toManyResponse(users: IUser[]) {
        return users.map(this.toResponse);
    }
}

export const userMapper = new UserMapper();
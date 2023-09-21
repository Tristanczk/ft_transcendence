import { User } from '../../types';
import ImageFriend from './friends/ImgFriend';

interface PresentationUserProps {
    user: User;
}

function PresentationUser({ user }: PresentationUserProps) {
    return (
        <header className="mb-0 sm:mb-6 not-format p-4">
            <address className="flex flex-wrap items-center justify-between mb-6 not-italic">
                <div className="flex items-center text-sm text-gray-900 dark:text-white lg:flex-shrink-0 lg:w-1/3">
                    <ImageFriend
                        userId={user.id}
                        textImg={user.nickname}
                        size={20}
                    />
                    <div className="ml-3">
                        <div className="text-5xl font-bold text-gray-900 dark:text-white">
                            {user.nickname}
                        </div>
                    </div>
                </div>
                <div className="text-mb sm:text-xl mt-2 font-light text-black dark:text-white">
                    Elo: {user.elo}
                </div>
            </address>
        </header>
    );
}

export default PresentationUser;

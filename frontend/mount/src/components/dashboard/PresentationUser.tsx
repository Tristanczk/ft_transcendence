import { User } from '../../types';
import ImageFriend, { ImageFriendPlaceholder } from './friends/ImgFriend';

const IMAGE_SIZE = 20;

interface PresentationUserProps {
    user: User | null;
}

function PresentationUser({ user }: PresentationUserProps) {
    if (user) {
        console.log(
            <ImageFriend
                userId={user.id}
                textImg={user.nickname}
                size={IMAGE_SIZE}
            />,
        );
    }
    return (
        <header className="mb-4 lg:mb-6 not-format p-4">
            <address className="flex flex-wrap items-center justify-between mb-6 not-italic">
                <div className="flex items-center text-sm text-gray-900 dark:text-white lg:flex-shrink-0 lg:w-1/3">
                    {user ? (
                        <ImageFriend
                            userId={user.id}
                            textImg={user.nickname}
                            size={IMAGE_SIZE}
                        />
                    ) : (
                        <ImageFriendPlaceholder size={IMAGE_SIZE} />
                    )}
                    {user && (
                        <div className=" ml-3 text-5xl font-bold text-gray-900 dark:text-white">
                            {user?.nickname ?? 'qqq'}
                        </div>
                    )}
                </div>
                {user && (
                    <div className="text-xl font-light text-gray-500 dark:text-gray-400">
                        ELO: {user.elo ?? '...'}
                    </div>
                )}
            </address>
        </header>
    );
}

export default PresentationUser;

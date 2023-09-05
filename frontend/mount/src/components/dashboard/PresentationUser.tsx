import { User } from '../../types';
import ImageFriend from './friends/ImgFriend';

interface PresentationUserProps {
    user: User;
}

function PresentationUser({ user }: PresentationUserProps) {
    return (
        <header className="mb-4 lg:mb-6 not-format">
            <address className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                    <ImageFriend
                        userId={user.id}
                        textImg={user.nickname}
                        size={12}
                    />
                    <div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {user.nickname}
                        </div>
                        <p className="text-base font-light text-gray-500 dark:text-gray-400">
                            Current ELO: {user.elo}
                        </p>
                    </div>
                </div>
            </address>
        </header>
    );
}

export default PresentationUser;

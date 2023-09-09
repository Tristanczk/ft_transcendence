import { User } from '../../types';
import ImageFriend from './friends/ImgFriend';

interface PresentationUserProps {
    user: User;
}

function PresentationUser({ user }: PresentationUserProps) {
    return (
        <header className="mb-4 lg:mb-6 not-format">
            <address className="flex flex-wrap items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white lg:flex-shrink-0 lg:w-1/3">
                    <ImageFriend
                        userId={user.id}
                        textImg={user.nickname}
                        size={12}
                    />
                    <div className="ml-3"> 
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

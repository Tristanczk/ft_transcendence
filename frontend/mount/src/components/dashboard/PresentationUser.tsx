import { User } from '../../types';
import ButtonDefyPlayer from './friends/ButtonPlayFriend';
import ImageFriend from './friends/ImgFriend';

interface PresentationUserProps {
    user: User;
}

function PresentationUser({ user }: PresentationUserProps) {
    return (
        <header className="mb-4 lg:mb-6 not-format p-4">
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
                        <ButtonDefyPlayer
                            userId={user.id}
                            initStatus={user.isConnected}
                            playingStatus={user.isPlaying}
                        />
                    </div>
                </div>
                <div className="text-xl font-light text-gray-500 dark:text-gray-400">
                    ELO: {user.elo}
                </div>
            </address>
        </header>
    );
}

export default PresentationUser;

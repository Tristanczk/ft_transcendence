export default function ChatContentSlide({
    channel,
    children,
}: {
    channel: number;
    children: any;
}) {
    return (
        <div
            className={`chat-content 
        ${channel ? 'opacity-100 delay-0' : 'opacity-0 delay-500'} 
        ${channel ? 'visible delay-500' : 'invisible delay-0'} 
        ${channel ? 'h-auto' : 'h-0'}
        transition-opacity transition-visibility transition-height duration-500`}
        >
            {children}
        </div>
        // Might cause problems with the transition div?
    );
}

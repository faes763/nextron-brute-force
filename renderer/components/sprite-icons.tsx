type IconProps = {
    name: string
    className: string
}

export function Icon({
    name,
    className
}: IconProps): JSX.Element {
    return (
        <svg className={className}>
            <use xlinkHref={`/images/sprite.svg#${name}`} />
        </svg>
    )
}
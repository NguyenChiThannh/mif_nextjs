export default function BiographySection({ bio }) {
    if (!bio) return null;

    return (
        <div className="bg-card rounded-lg p-4 shadow">
            <p className="text-justify">{bio}</p>
        </div>
    )
} 
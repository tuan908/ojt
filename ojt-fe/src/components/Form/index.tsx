export default function Form() {
    return (
        <form className="flex flex-col gap-y-2 w-full">
            <label htmlFor="selectEvent">Select Event</label>
            <input
                className="px-4 py-2 rounded-md focus:outline-blue-400"
                type="text"
                title="Select an event"
                placeholder="Select an event"
            />
        </form>
    );
}

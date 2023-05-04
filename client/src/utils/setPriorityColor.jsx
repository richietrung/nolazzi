export default function setPriorityColor(priority) {
    switch (priority) {
        case 'high':
            return '#EC7063';
        case 'medium':
            return '#E67E22';
        case 'low':
            return '#58D68D';
        default:
            return 'black';
    }
}

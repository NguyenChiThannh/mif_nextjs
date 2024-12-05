export const QUERY_KEY = {
    // Movie
    newestMovies: (page, size) => ['newest_movies', { page, size }],
    randomMovies: 'random_movies',
    allMovies: (page, size) => ['all_movies', { page, size }],
    searchMoviesByTitle: (page, size, title) => ['search_movies_by_title', { page, size, title }],
    movieById: (id) => ['detail_movie', id],
    //Group
    groupsByOwnerId: (page, size) => ['groups_owner', { page, size }],
    userGroups: (page, size, id) => ['user_groups', { page, size, id }],
    groupsUserNotJoin: (size) => ['groups_user_not_join', { size }],
    detailGroup: (id) => ['group', id],
    memberGroup: (id) => ['member_group', id],
    pendingInvitations: (groupId, size) => ['pending_invitations', { groupId, size }],
    searchGroupByGroupName: (search) => ['search_group_by_group_name', search],
    // Actor
    actorMovieography: (actorId) => ['actor_movieography', actorId],
    actorById: (actorId) => ['actor', actorId],
    topActors: (page, size) => ['top_actor', { page, size }],
    topActorsInfinite: () => ['top_actor'],
    // Category
    allmovieCategories: () => 'all_categories',
    categoryById: (id) => ['category', id],
    // FavoriteActors
    favoriteActors: () => ['favorite_actors'],
    // user
    userInfoById: (id) => ['user_info', id],
    profilePostByUserId: (id) => ['post_user', id],
    // group_posts
    groupPosts: (groupId) => ['group_posts', { groupId }],
    postById: (postId) => ['detail_post', postId],
    // group_rules
    groupRules: (groupId) => ['group_rules', groupId],
    // movie Rating
    movieRatings: (page, size, movieId) => ['movie_ratings', { page, size, movieId }],
    // SavedMovie 
    savedMovie: (userId) => ['saved_movie', { userId }],
    // savedPost
    savedPosts: (userId) => ['saved_posts', { userId }],
    // notification
    notifications: () => ['notifications'],
    unreadNotificationCount: () => ['unread_notification_count'],
    // event
    getSubscribedEvents: () => ['subscribed_events'],
    getEventsByGroupId: (groupId) => ['events_by_groupId', groupId],

}
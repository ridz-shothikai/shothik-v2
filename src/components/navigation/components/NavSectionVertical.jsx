import NavList from "./NavList";

// ----------------------------------------------------------------------

export default function NavSectionVertical({ data, user, onCloseNav }) {
  return (
    <div className="flex flex-col">
      {data.map((group) => {
        if (group.roles && !group.roles.includes(user?.role)) {
          return null;
        }
        const key = group.subheader || group.items[0].title;
        return (
          <div key={key} className="px-2">
            {group.subheader && (
              <div className="text-muted-foreground pt-12 pb-4 text-[11px] font-medium tracking-[0.08em] uppercase">
                {group.subheader}
              </div>
            )}

            {group.items.map((list) => (
              <NavList
                key={list.title + list.path}
                data={list}
                layout="vertical"
                onCloseNav={onCloseNav}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

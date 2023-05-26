import { RegularUserFragment, User } from "../generated/graphql";
import { NavBar } from "./NavBar";
import { Wrapper, WrapperVariant } from "./Wrapper";

interface LayoutProps {
  variant?: WrapperVariant;
  children?: React.ReactNode;
  user?: RegularUserFragment | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant, user }) => {
  return (
    <>
      <NavBar user={user || null} />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

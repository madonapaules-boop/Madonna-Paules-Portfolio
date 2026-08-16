import { trpc } from "@/lib/trpc";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("madonapaules@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = trpc.owner.login.useMutation({ onSuccess: () => setLocation("/admin") });
  const submit = (event: FormEvent) => { event.preventDefault(); login.mutate({ email, password }); };
  return <main className="admin-login-page"><section className="login-card"><div className="login-mark">M</div><p className="login-kicker">Owner access</p><h1>Dashboard login</h1><p>Enter your owner credentials to manage the portfolio.</p><form onSubmit={submit}><label><span>Email</span><div><Mail size={17} /><input value={email} type="email" onChange={event => setEmail(event.target.value)} required autoComplete="email" /></div></label><label><span>Password</span><div><LockKeyhole size={17} /><input value={password} type={showPassword ? "text" : "password"} onChange={event => setPassword(event.target.value)} required autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(value => !value)} aria-label="Show password">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{login.isError && <p className="login-error">The email or password is incorrect.</p>}<button className="login-submit" disabled={login.isPending}>{login.isPending ? "Signing in…" : "Sign in"}</button></form><Link href="/"><ArrowLeft size={15} />Back to portfolio</Link></section></main>;
}

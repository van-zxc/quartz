标签：[[数学]] [[微分方程]] [[微积分]] [[公式]]

>[!theorem] Gronwall不等式
>设 $u(t)$ 为定义在区间 $[t_0, t_1]$ 上的连续可微函数，$\beta(t)$ 为连续函数。若 $u(t)$ 满足微分不等式：
>$$
>\frac{\mathrm{d}u}{\mathrm{d}t}(t) \le \beta(t) u(t), \quad \forall t \in [t_0, t_1]
>$$
>则对任意 $t \in [t_0, t_1]$，均有：
>$$
>u(t) \le u(t_0) \exp\left( \int_{t_0}^{t} \beta(s) \, \mathrm{d}s \right)
>$$

证明的关键在于构造积分因子，将微分不等式转化为全导数形式。

定义辅助函数：
$$
v(t) = \exp\left( -\int_{t_0}^{t} \beta(s) \, \mathrm{d}s \right)
$$
根据指数函数的性质，$v(t) > 0$ 对任意 $t \in [t_0, t_1]$ 恒成立。

对 $v(t)$ 求导：
$$
\frac{\mathrm{d}v}{\mathrm{d}t}(t) = -\beta(t) \exp\left( -\int_{t_0}^{t} \beta(s) \, \mathrm{d}s \right) = -\beta(t) v(t)
$$
考虑乘积函数 $w(t) = u(t) v(t)$，对其求导：
$$
\begin{aligned} 
\frac{\mathrm{d}}{\mathrm{d}t} \left[ u(t) v(t) \right] &= \frac{\mathrm{d}u}{\mathrm{d}t}(t) v(t) + u(t) \frac{\mathrm{d}v}{\mathrm{d}t}(t) \\ &= \frac{\mathrm{d}u}{\mathrm{d}t}(t) v(t) - \beta(t) u(t) v(t) \\ &= \left[ \frac{\mathrm{d}u}{\mathrm{d}t}(t) - \beta(t) u(t) \right] v(t) 
\end{aligned}
$$
由假设条件 $\frac{\mathrm{d}u}{\mathrm{d}t}(t) - \beta(t) u(t) \le 0$，且 $v(t) > 0$，故：
$$
\frac{\mathrm{d}}{\mathrm{d}t} \left[ u(t) v(t) \right] \le 0
$$

函数 $w(t) = u(t)v(t)$ 在区间 $[t_0, t_1]$ 上单调递减，因此对任意 $t \in [t_0, t_1]$，对上式在 $[t_0, t]$ 上进行积分：
$$
\int_{t_0}^{t} \frac{\mathrm{d}}{\mathrm{d}s} \left[ u(s) v(s) \right] \mathrm{d}s \le 0
$$
根据微积分基本定理：
$$
u(t) v(t) - u(t_0) v(t_0) \le 0
$$
$v(t_0) = e^0 = 1$，因此：
$$
u(t) v(t) \le u(t_0)
$$
$$u(t) \le \frac{u(t_0)}{v(t)} = u(t_0) \exp\left( \int_{t_0}^{t} \beta(s) \, \mathrm{d}s \right)$$
标签：[[物理]] [[电磁感应]] [[分析]] [[电感]] [[电阻]] [[电磁学]]

# 闭合回路

根据[[基尔霍夫方程组]]，
$$
\varepsilon - iR - L \frac{\mathrm{d}i}{\mathrm{d}t} = 0
$$
$$
\frac{\mathrm{d}i}{\mathrm{d}t} = \frac{\varepsilon}{L} - \frac{R}{L}i
$$
有：
$$
\frac{\mathrm{d}i}{\frac{\varepsilon}{R} - i} = -\frac{R}{L}\mathrm{d}t
$$
$$
i = \frac{\varepsilon}{R} (1-e^{-(R/L)t})
$$

# 衰减

$$
-iR - L\frac{\mathrm{d}i}{\mathrm{d}t} = 0
$$
$$
i = I_{0} \cdot e^{-(R/L)t}
$$

# 能量

电源瞬时功率 = 电阻耗散能量 + 电感能量
$$
\varepsilon_i = Li\mathrm{d}i + i^2 R
$$
